import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGroups } from "../../services/groupApi";
import { setGroup } from "../store/groupSlice";

export function GroupProvider({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: groupList, error } = useGroups(user?._id);

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
