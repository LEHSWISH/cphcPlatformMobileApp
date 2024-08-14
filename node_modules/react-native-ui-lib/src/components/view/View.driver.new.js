import { useComponentDriver } from "../../testkit/new/Component.driver";
export const ViewDriver = props => {
  const driver = useComponentDriver(props);
  const getStyle = () => {
    return driver.getElement().props.style;
  };
  return {
    ...driver,
    getStyle
  };
};