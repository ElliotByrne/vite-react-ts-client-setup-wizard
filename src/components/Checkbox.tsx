interface CheckboxInterface {
  checked?: boolean;
}

export const Checkbox = ({ icon }: CheckboxInterface) => {
  return <input type="checkbox" name="checkbox-row" />;
};

export default { Checkbox };
