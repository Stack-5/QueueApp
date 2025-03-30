enum ActionType {
  LOG_IN = "LOG_IN",
  LOG_OUT = "LOG_OUT",
  SERVE_CUSTOMER = "SERVE_CUSTOMER",
  COMPLETE_TRANSACTION = "COMPLETE_TRANSACTION",
  ASSIGN_ROLE = "ASSIGN_ROLE",
  ADD_STATION = "ADD_STATION",
  EDIT_STATION = "EDIT_STATION",
  DELETE_STATION = "DELETE_STATION",
  ADD_COUNTER = "ADD_COUNTER",
  EDIT_COUNTER = "EDIT_COUNTER",
  DELETE_COUNTER = "DELETE_COUNTER"
}

type ActivityLog = {
  id: string;
  uid: string;
  action: ActionType;
  timestamp: number;
  details?: string;
}

export {ActionType, ActivityLog};
