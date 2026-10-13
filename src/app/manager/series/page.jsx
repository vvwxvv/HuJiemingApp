"use client";

import React, { useMemo } from "react";
import { seriesSchemaConfig } from "@/components/pages/manager/config/seriesSchemaConfig";
import ManagerStructureLayout from "@/components/pages/manager/layouts/ManagerStructureLayout";

export default function seriesManagerPage() {
  const managerSchemaConfig = useMemo(() => {
    return {
      ...seriesSchemaConfig,
      dataConfig: {
        ...seriesSchemaConfig.dataConfig,
        defaultSort: { field: "order", direction: "asc" },
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
