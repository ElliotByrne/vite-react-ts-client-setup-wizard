import { ReactNode } from "react";

interface FormInterface {
  children: ReactNode | Array<ReactNode> | null;
  handleClose: () => void;
  postData: () => void;
}

export const FormAddNew = ({
  children,
  handleClose,
  postData,
}: FormInterface) => {
  // const handleSubmit = (e: any) => {
  //   e.preventDefault();

  //   postData(
  //     e.target.todo.value,
  //     e.target.completed.checked,
  //     e.target.userId.value
  //   );

  //   e.target.reset();
  // };

  return (
    <form
      className="form"
      // onSubmit={(e) => handleSubmit(e)}
    >
      <div>
        <label className="form__label" htmlFor="name">
          Client name
        </label>
        <input type="text" name="name" />
      </div>
      <div>
        <label className="form__label" htmlFor="name">
          Date of birth (dd/mm/yy)
        </label>
        <input type="text" name="dob" />
      </div>
      <div>
        <label className="form__label" htmlFor="name">
          Primary language
        </label>
        <input type="text" name="primary-language" />
      </div>
      <div>
        <label className="form__label" htmlFor="name">
          Secondary language
        </label>
        <input type="text" name="secondary-language" />
      </div>
      <div>
        <label className="form__label" htmlFor="completed">
          Primary funding source
        </label>
        <select value="NDIS" name="funding">
          <option value="NDIS">NDIS</option>
          <option value="HCP">HCP</option>
          <option value="CHSP">CHSP</option>
          <option value="DVA">DVA</option>
          <option value="HACC">HACC</option>
        </select>
      </div>

      <div>
        <input type="checkbox" name="confirm" />
        <label htmlFor="confirm" className="form__label form__label--checkbox">
          Confirm if you believe the information filled out in this form is
          correct.
        </label>
      </div>

      <div className="col col--gap col--row form__footer">
        <div className="col col--fill">
          <button className="button button--outline" type="submit">
            Add another
          </button>
        </div>
        <div className="col col--fill">
          <button
            className="button button--fill"
            type="submit"
            onClick={() => handleClose()}
          >
            Add and close
          </button>
        </div>
      </div>
    </form>
  );
};
