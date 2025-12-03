import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGroups } from "../../services/groupApi";
import { setGroup } from "../store/groupSlice";

export function GroupProvider({ children }) {
  const dispatch = useDispatch();
  const { data: groupList, error } = useGroups();

  useEffect(() => {
    if (groupList) {
      dispatch(setGroup(groupList));
    }
  }, [groupList, dispatch]);

  if (error) {
    console.error("Failed to fetch groups:", error.message);
  }

  return <>{children}</>;
}
