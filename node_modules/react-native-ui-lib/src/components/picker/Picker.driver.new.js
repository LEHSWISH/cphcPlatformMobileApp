import { TextFieldDriver } from "../textField/TextField.driver.new";
import { ModalDriver } from "../modal/Modal.driver.new";
import { DialogDriver } from "../../incubator/Dialog/Dialog.driver.new";
import { ButtonDriver } from "../button/Button.driver.new";
export const PickerDriver = props => {
  const textFieldDriver = TextFieldDriver({
    renderTree: props.renderTree,
    testID: `${props.testID}.input`
  });
  const modalDriver = ModalDriver({
    renderTree: props.renderTree,
    testID: `${props.testID}.overlay`
  });
  const dialogDriver = DialogDriver({
    renderTree: props.renderTree,
    testID: `${props.testID}.overlay`
  });
  const cancelButtonDriver = ButtonDriver({
    renderTree: props.renderTree,
    testID: `${props.testID}.modal.topBar.cancel`
  });
  const doneButtonDriver = ButtonDriver({
    renderTree: props.renderTree,
    testID: `${props.testID}.modal.topBar.done`
  });
  const getValue = () => {
    return textFieldDriver.getValue();
  };
  const open = () => {
    textFieldDriver.press();
  };
  const cancel = () => {
    cancelButtonDriver.press();
  };
  const done = () => {
    doneButtonDriver.press();
  };
  const isOpen = () => {
    if (dialogDriver.exists()) {
      return dialogDriver.isVisible();
    }
    return modalDriver.exists() && modalDriver.isVisible();
  };
  const dismissDialog = () => {
    if (dialogDriver.isVisible()) {
      dialogDriver.pressOnBackground();
    }
  };
  const selectItem = testID => {
    const itemDriver = ButtonDriver({
      renderTree: props.renderTree,
      testID
    });
    itemDriver.press();
  };
  return {
    getValue,
    open,
    cancel,
    done,
    isOpen,
    dismissDialog,
    selectItem
  };
};