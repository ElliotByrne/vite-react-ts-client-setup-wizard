import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// yup schema - form client side validation.
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(30, "Maximum of 30 characters allowed"),
  dob: yup.string().required("Date of birth is required"),
  "primary-language": yup
    .string()
    .required("Primary language is a required field")
    .max(50, "Maximum of 50 characters allowed"),
  "secondary-language": yup
    .string()
    .required("Secondary language is a required field")
    .max(30, "Maximum of 50 characters allowed"),
});

const FormError = ({ message }: { message: string }) => {
  return <p className="form__error">{message}</p>;
};

export const FormAddNew = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data: any) => console.log(data);
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="form__label" htmlFor="name">
          Client name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: true, maxLength: 30 })}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && <FormError message={errors?.name?.message || ""} />}
      </div>
      <div>
        <label className="form__label" htmlFor="name">
          Date of birth (dd/mm/yy)
        </label>
        <input type="text" name="dob" />
        {errors.dob && <FormError message={errors?.dob?.message || ""} />}
      </div>
      <div>
        <label className="form__label" htmlFor="name">
          Primary language
        </label>
        <input type="text" name="primary-language" />
        {errors["primary-language"] && (
          <FormError message={errors?.["primary-language"].message || ""} />
        )}
      </div>
      <div>
        <label className="form__label" htmlFor="name">
          Secondary language
        </label>
        <input type="text" name="secondary-language" />
        {errors["secondary-language"] && (
          <FormError message={errors?.["secondary-language"].message || ""} />
        )}
      </div>
      <div>
        <label className="form__label" htmlFor="completed">
          Primary funding source
        </label>
        <select name="funding">
          <option value="NDIS">NDIS</option>
          <option value="HCP">HCP</option>
          <option value="CHSP">CHSP</option>
          <option value="DVA">DVA</option>
          <option value="HACC">HACC</option>
        </select>
      </div>

      <div className="form__checkbox">
        <input type="checkbox" name="confirm" id="confirm" required />
        <label htmlFor="confirm" className="form__label form__label--checkbox">
          Confirm that you have permission to add clients to the database.
          Misuse of this form will have your access revoked.
        </label>
      </div>

      <div className="col col--fill  form__footer">
        {errors && (
          <FormError message="The form has errors, please recheck each input has been filled out correctly." />
        )}
      </div>

      <div className="col col--gap col--row">
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
