import CustomTextInput, { ICustomTextInput } from "../CustomTextInput";

interface ICustomSearchBar extends ICustomTextInput {}

const CustomSearchBar = ({ ...CustomTextInputProps }: ICustomSearchBar) => {
  return <CustomTextInput {...CustomTextInputProps} />;
};

export default CustomSearchBar;
