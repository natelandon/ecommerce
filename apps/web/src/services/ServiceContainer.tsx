import * as React from "react";

import { DefaultProductFilterService } from "./ProductFilterService";
import { HttpProductService } from "./ProductService";

export type ServiceContainer = {
  productService: HttpProductService;
  productFilterService: DefaultProductFilterService;
};

const ServiceContainerContext = React.createContext<ServiceContainer | null>(null);

export function ServiceContainerProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const container = React.useMemo<ServiceContainer>(
    () => ({
      productService: new HttpProductService(),
      productFilterService: new DefaultProductFilterService()
    }),
    []
  );

  return (
    <ServiceContainerContext.Provider value={container}>
      {children}
    </ServiceContainerContext.Provider>
  );
}

export function useServices() {
  const context = React.useContext(ServiceContainerContext);

  if (!context) {
    throw new Error("ServiceContainerProvider is missing");
  }

  return context;
}
