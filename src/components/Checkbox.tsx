interface CheckboxInterface {
  checked?: boolean;
}

export const Checkbox = ({ checked }: CheckboxInterface) => {
  return (
    <input type="checkbox" name="checkbox-row" checked={checked} readOnly />
  );
};

export default { Checkbox };
