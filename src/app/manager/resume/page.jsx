"use client";

import React, { useMemo } from "react";
import { resumeSchemaConfig } from "@/components/pages/manager/config/resumeSchemaConfig";
import ManagerStructureLayout from "@/components/pages/manager/layouts/ManagerStructureLayout";

export default function resumeManagerPage() {
  const managerSchemaConfig = useMemo(() => {
    return {
      ...resumeSchemaConfig,
      dataConfig: {
        ...resumeSchemaConfig.dataConfig,
        defaultSort: { field: "year", direction: "desc" },
        groupConfig: {
          enabled: true,
          field: "artist",
          applyTo: ["grid", "list"],
          sortGroups: true,
          emptyLabel: "Ungrouped",
        },
      },
    };
  }, []);

  return <ManagerStructureLayout managerSchemaConfig={managerSchemaConfig} />;
}
