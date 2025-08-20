import { Fragment, useEffect } from "react";
import { data$, setAttributes } from "../shared/layouts-components/services/switcherServices";

function RootWrapper({ children }: any) {
  useEffect(() => {
    // Subscribe to state changes
    const subscription = data$.subscribe(() => {
      setAttributes(); // Update <html> attributes when state changes
    });
    // Initial attribute setup
    setAttributes();

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return <Fragment>{children}</Fragment>;
}

export default RootWrapper;
