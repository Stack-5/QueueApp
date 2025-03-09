import { router } from "expo-router";

type OptionAdminType = {
  key: number;
  iconName: string;
  label: string;
};

const adminOptions: OptionAdminType[] = [
  {
    key: 1,
    iconName: "account-cog",
    label: "Manage employees",
  },
  {
    key: 2,
    iconName: "account-cash",
    label: "Manage stations",
  },
  {
    key: 3,
    iconName: "account-details",
    label: "View logs",
  },
  {
    key: 4,
    iconName: "account-alert",
    label: "Review pending accounts",
  },
];

const optionMethods = (key: number) => {
  switch (key) {
    case 1:
      return () => {
        router.push("/admin/employee/manage-employees");
      };
    case 2:
      return () => {
        router.push("/admin/station/manage-stations");
      };
    case 3:
      return () => {
        router.push("/admin/view-logs");
      };
    case 4:
      return () => {
        router.push("/admin/pending/manage-pending");
      };
    default:
      return () => {};
  }
};
export { adminOptions, optionMethods };
