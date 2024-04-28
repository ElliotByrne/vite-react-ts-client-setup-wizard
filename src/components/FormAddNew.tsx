import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ModalContext } from "../global-state/ModalContext";
import { useContext, useEffect, useState } from "react";
import { useFetchAllClients } from "../hooks/useFetchAllClients";
import { ClientInterface } from "../interfaces/client.interface";

type FormValues = {
  name: string;
  dob: string;
  primary_language: string;
  secondary_language: string;
  funding: string;
  confirm: boolean;
};

// yup schema - form client side validation.
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .max(30, "Maximum of 30 characters allowed"),
  dob: yup.string().required("Date of birth is required"),
  primary_language: yup
    .string()
    .required("Primary language is a required field")
    .max(50, "Maximum of 50 characters allowed"),
  secondary_language: yup
    .string()
    .required("Secondary language is a required field")
    .max(30, "Maximum of 50 characters allowed"),
  funding: yup.string(),
  confirm: yup.boolean().required(),
});

const FormError = ({ message }: { message: string }) => {
  return <p className="form__error">{message}</p>;
};

const postClient = async (data) => {
  return await fetch(`http://localhost:3000/clients`, {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const putClient = async (data, id) => {
  return await fetch(`http://localhost:3000/clients/${id}`, {
    method: "PUT",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const FormAddNew = () => {
  const [modalContext, setModalContext] = useContext(ModalContext);
  const { refetch, data } = useFetchAllClients();
  const [dataEditing, setDataEditing] = useState<Array<ClientInterface>>([]);

  useEffect(() => {
    if (modalContext.editing) {
      setDataEditing(data.filter((el) => el.id == modalContext.editing));
    } else {
      setDataEditing([]);
    }
  }, [modalContext, data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (dataEditing.length > 0) {
      setValue("name", dataEditing[0].name);
      setValue("dob", dataEditing[0].dob);
      setValue("primary_language", dataEditing[0].primary_language);
      setValue("secondary_language", dataEditing[0].secondary_language);
      setValue("funding", dataEditing[0].funding);
    } else {
      reset();
    }
  }, [dataEditing, reset, setValue]);

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (dataEditing.length === 0) {
      postClient(data);
    } else {
      putClient(data, modalContext.editing);
    }

    reset();
    refetch();
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="form__label" htmlFor="name">
          Client name
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && <FormError message={errors?.name?.message || ""} />}
      </div>
      <div>
        <label className="form__label" htmlFor="dob">
          Date of birth (dd/mm/yy)
        </label>
        <input
          type="text"
          id="dob"
          {...register("dob")}
          aria-invalid={errors.dob ? "true" : "false"}
        />
        {errors.dob && <FormError message={errors?.dob?.message || ""} />}
      </div>
      <div>
        <label className="form__label" htmlFor="primary_language">
          Primary language
        </label>
        <input
          type="text"
          id="primary_language"
          {...register("primary_language")}
          aria-invalid={errors["primary_language"] ? "true" : "false"}
        />
        {errors["primary_language"] && (
          <FormError message={errors?.["primary_language"].message || ""} />
        )}
      </div>
      <div>
        <label className="form__label" htmlFor="secondary_language">
          Secondary language
        </label>
        <input
          type="text"
          id="secondary_language"
          {...register("secondary_language")}
          aria-invalid={errors["secondary_language"] ? "true" : "false"}
        />
        {errors["secondary_language"] && (
          <FormError message={errors?.["secondary_language"].message || ""} />
        )}
      </div>
      <div>
        <label className="form__label" htmlFor="funding">
          Primary funding source
        </label>
        <select id="funding" {...register("funding")}>
          <option value="NDIS">NDIS</option>
          <option value="HCP">HCP</option>
          <option value="CHSP">CHSP</option>
          <option value="DVA">DVA</option>
          <option value="HACC">HACC</option>
        </select>
      </div>

      <div className="form__checkbox">
        <input type="checkbox" id="confirm" required {...register("confirm")} />
        <label htmlFor="confirm" className="form__label form__label--checkbox">
          Confirm that you have permission to add clients to the database.
          Misuse of this form will have your access revoked.
        </label>
      </div>

      <div className="col col--fill  form__footer">
        {Object.keys(errors).length > 0 && (
          <FormError message="The form has errors, please recheck each input has been filled out correctly." />
        )}
      </div>

      <div className="col col--gap col--row">
        <div className="col col--fill">
          <button className="button button--fill" type="submit" data-wizard={2}>
            Submit
          </button>
        </div>
        <div className="col col--fill">
          <button
            className="button button--outline"
            type="reset"
            data-wizard={3}
            onClick={() => {
              reset();
              setModalContext({ isOpen: false });
            }}
          >
            Close
          </button>
        </div>
      </div>
    </form>
  );
};
