import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCategory } from "../../services/categoryApi";
import { setCategory } from "../store/categorySlice";
import { useAuth } from "../../contexts/AuthContext";

export function CategoryProvider({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: categoryList, error } = useCategory(user?._id);

  useEffect(() => {
    if (categoryList) {
      dispatch(setCategory(categoryList));
    }
  }, [categoryList, user, dispatch]);

  if (error) {
    console.error("Failed to fetch categories:", error.message);
  }

  return <>{children}</>;
}
