import { useCallback, useContext, useEffect, useState } from "react";
import { WizardContext } from "../global-state/WizardContext";
import { ModalContext } from "../global-state/ModalContext";
import classNames from "classnames";
import { IconButton } from "./IconButton";
import { Icon } from "./Icon";

export const Wizard = () => {
  const [wizardContext, setWizardContext] = useContext(WizardContext);
  const [modalContext, setModalContext] = useContext(ModalContext);
  const [spotlightPos, setSpotlightPos] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [tipScale, setTipScale] = useState(false);

  const wizardSetup = {
    1: {
      msg: "Click here to add a new client to the database.",
      action: () => setModalContext(false),
    },
    2: {
      msg: "Once you've filled out the form fields, click here to submit the form and add start filling out another straight away.",
      action: () => setModalContext(true),
    },
    3: {
      msg: "Or you can click here to submit the form and view your new additions in the table.",
      action: () => setModalContext(true),
    },
    4: {
      msg: "Click on a table row to select that client. You can select multiple clients at once and perform grouped actions.",
      action: () => setModalContext(false),
    },
    5: {
      msg: "Click on the delete button to delete the clients that are currently selected.",
    },
    6: { msg: "This button will refresh the data in the table." },
    7: {
      msg: "Click here to download the table data as a CSV, which can be imported into a spreadsheet.",
    },
    8: { msg: "You can copy the contents of this row to your clipboard." },
  };

  const getSpotlightedEl = useCallback(() => {
    // Run action of previous step
    if (wizardSetup[wizardContext]?.action) {
      wizardSetup[wizardContext]?.action();
    }
    const allElements = document?.querySelectorAll(`.wizard-element`);
    const element = document?.querySelector(`[data-wizard="${wizardContext}"]`);

    const pos = element?.getBoundingClientRect();

    for (let i = 0; i < allElements.length; i++) {
      allElements[i].classList.remove("wizard-element");
    }

    if (element && pos) {
      setSpotlightPos({
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
      });
      element?.classList.add("wizard-element");
      setTipScale(true);
      setTimeout(() => {
        setTipScale(0);
      }, 300);
    }
  }, [wizardContext]);

  useEffect(() => {
    let throttled = false;
    // listen to window resize, so we can keep spotlight on top of the element.
    window.addEventListener("resize", function () {
      // throttled so we aren't rerendering so often
      if (!throttled) {
        getSpotlightedEl();
        // we're throttled!
        throttled = true;
        // set a timeout to un-throttle
        setTimeout(function () {
          throttled = false;
        }, 100);
      }
    });
  }, [getSpotlightedEl]);

  useEffect(() => {
    if (wizardContext > 0) {
      getSpotlightedEl();
    }
    if (
      wizardContext >
      Object.keys(wizardSetup)[Object.keys(wizardSetup).length - 1]
    ) {
      setWizardContext(0);
    }
  }, [wizardContext, getSpotlightedEl]);

  const classes = classNames({
    wizard: true,
    "wizard--active": wizardContext > 0,
  });

  const tipTextClasses = classNames({
    wizard__dialog__tip: true,
    "wizard__dialog__tip--scaled": tipScale,
  });

  return (
    <div className={classes}>
      <span
        className="wizard__spotlight"
        style={{
          top: `${spotlightPos?.y}px`,
          left: `${spotlightPos?.x}px`,
          height: `${spotlightPos?.height}px`,
          width: `${spotlightPos?.width}px`,
        }}
      ></span>
      <div className="wizard__dialog">
        <div className="wizard__dialog__inner">
          <span className="wizard__dialog__close">
            <IconButton onClick={() => setWizardContext(0)}>
              <Icon icon="cross" />
            </IconButton>
          </span>

          <p className={tipTextClasses}>
            <Icon icon="wizard" height="0.5rem" width="0.5rem" />
            Tip {wizardContext}: {wizardSetup[wizardContext]?.msg}
          </p>

          <div className="wizard__dialog__buttons-wrapper">
            <button
              className="button button--small"
              onClick={() => setWizardContext(wizardContext - 1)}
            >
              <span>{wizardContext > 1 ? "Previous tip" : "Close wizard"}</span>
            </button>
            <button
              className="button button--small"
              onClick={() => setWizardContext(wizardContext + 1)}
            >
              <span>
                {wizardContext ==
                Object.keys(wizardSetup)[Object.keys(wizardSetup).length - 1]
                  ? "Close wizard"
                  : "Next tip"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default { Wizard };
