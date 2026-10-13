"use client";
import React, { useMemo } from "react";
import { ArtistContactSchemaConfig } from "@/components/pages/manager/config/artistContactSchemaConfig";

import ManagerStructureLayout from "@/components/pages/manager/layouts/ManagerStructureLayout";

export default function GalleryArtistContactManagerPage() {
  const managerSchemaConfig = useMemo(() => {
    return {
      ...ArtistContactSchemaConfig,
      dataConfig: {
        ...ArtistContactSchemaConfig.dataConfig,
      },
    };
  }, []);

  return (
<ManagerStructureLayout managerSchemaConfig={managerSchemaConfig} />
  );
}
