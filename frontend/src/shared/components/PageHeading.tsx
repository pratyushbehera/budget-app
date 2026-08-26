import React from "react";
import Typography from "@/shared/system/Typography";

interface PageHeadingType {
  title: string;
  subtitle?: string;
}
const PageHeading = ({ title, subtitle }: PageHeadingType) => {
  return (
    <div className="space-y-2">
      <Typography variant="h1">{title}</Typography>
      {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
    </div>
  );
};

export default PageHeading;
