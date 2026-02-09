import * as yup from 'yup';

export const productSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  price: yup.number().min(0).required(),
  description: yup.string().optional(),
});
