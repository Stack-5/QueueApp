import { Response } from "express";
import AuthRequest from "../types/AuthRequest";
import { auth, realtimeDb } from "../config/firebaseConfig";

export const getPendingUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }
    const userList = await auth.listUsers();
    console.dir(userList, { depth: null });
    const pendingUsers = userList.users
      .filter(
        (user) =>
          user.customClaims?.role === "pending" && user.uid !== req.user?.uid
      )
      .map((user) => ({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.customClaims?.role,
        createdAt: user.metadata.creationTime,
      }));
    res.status(200).json({ pendingUsers: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const userList = await auth.listUsers();
    const allowedRolesToGet =
      req.user!.role === "superAdmin" ?
        ["admin", "cashier", "information"] :
        ["cashier", "information"];
    const employees = userList.users
      .filter(
        (user) =>
          user.customClaims?.role &&
          allowedRolesToGet.includes(user.customClaims.role) &&
          user.uid !== req.user!.uid
      )
      .map((user) => ({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: user.customClaims?.role,
        createdAt: user.metadata.creationTime,
      }));
    console.log(employees);
    res.status(200).json({ employees: employees });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const assignUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { uid, role }: { uid: string; role: string } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized request" });
      return;
    }

    const validRolesForAdmin = ["cashier", "information"];
    const validRolesForSuperAdmin = [
      "admin",
      "cashier",
      "information",
      "superAdmin",
    ];
    const requesterRole = req.user.role;

    if (
      (requesterRole === "admin" && !validRolesForAdmin.includes(role)) ||
      (requesterRole === "superAdmin" && !validRolesForSuperAdmin.includes(role))
    ) {
      res.status(403).json({ message: "Unauthorized to assign this role" });
      return;
    }
    const userRef = realtimeDb.ref(`users/${uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists()) {
      res.status(404).json({ message: "Invalid user" });
      return;
    }

    const existingData = snapshot.val();
    console.log(existingData.role);

    if (existingData.role === "cashier" && role !== "cashier") {
      const countersRef = realtimeDb.ref("counters");
      const countersSnapshot = await countersRef.get();

      const assignedCounters = await Promise.all(
        countersSnapshot.val() ?
          Object.entries(
              countersSnapshot.val() as Record<
                string,
                { counterNumber: number; stationID: string; uid: string }
              >
          ).map(async ([counterId, counterData]) => {
            if (counterData.uid === uid) {
              const stationRef = realtimeDb.ref(`stations/${counterData.stationID}`);
              const stationSnapshot = await stationRef.get();
              return {
                counterId,
                counterNumber: counterData.counterNumber,
                stationName: stationSnapshot.exists() ? stationSnapshot.val().name : "Unknown Station",
              };
            }
            return null;
          }) :
          []
      );

      const activeAssignment = assignedCounters.find((counter) => counter !== null);

      if (activeAssignment) {
        res.status(400).json({
          // eslint-disable-next-line max-len
          message: `This cashier is assigned to station '${activeAssignment.stationName}', counter: ${activeAssignment.counterNumber}. Remove them from the station before changing roles.`,
        });
        return;
      }
    }

    await auth.setCustomUserClaims(uid, { role: role });
    await auth.revokeRefreshTokens(uid);

    await userRef.set({
      role: role,
      ...(role === "cashier" ? { station: existingData.station ?? null } : {}),
    });

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};


export const getUserData = async (req: AuthRequest, res: Response) => {
  try {
    const { uid } = req.params;
    const userRecord = await auth.getUser(uid);
    res.status(200).json({ userData: userRecord });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAvailableCashierEmployees = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userList = await auth.listUsers();
    const cashierEmployees = userList.users.filter(
      (user) => user.customClaims?.role === "cashier"
    );

    const usersRef = realtimeDb.ref("users");
    const userSnapshot = await usersRef.get();

    const usersData = userSnapshot.val() ?? [];

    const availableCashiers = cashierEmployees.filter((cashier) => {
      const userData = usersData[cashier.uid];
      return userData && !userData.counterID;
    });

    res.status(200).json({ availableCashiers });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
