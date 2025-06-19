import { useState } from 'react';

export default function DishForm({ initialValues, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues || {
    name: '',
    description: '',
    price: 0,
    weight: 0,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name) newErrors.name = 'Name is required';
    if (!values.description) newErrors.description = 'Description is required';
    if (!values.price || values.price <= 0) newErrors.price = 'Price must be positive';
    if (!values.weight || values.weight <= 0) newErrors.price = 'Weight must be positive';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Название</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={values.name}
          onChange={handleChange}
        />
        {errors.name && <div className="text-danger">{errors.name}</div>}
      </div>

      <div>
        <label>Описание</label>
        <textarea
          name="description"
          className="form-control"
          value={values.description}
          onChange={handleChange}
        />
        {errors.description && <div className="text-danger">{errors.description}</div>}
      </div>

      <div>
        <label>Цена</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={values.price}
          onChange={handleChange}
        />
        {errors.price && <div className="text-danger">{errors.price}</div>}
      </div>

      <div>
        <label>Вес</label>
        <input
          type="number"
          name="weight"
          className="form-control"
          value={values.weight}
          onChange={handleChange}
        />
        {errors.weight && <div className="text-danger">{errors.weight}</div>}
      </div>

      <button type="submit" className="btn btn-primary">
        {initialValues ? 'Изменить' : 'Создать'}
      </button>
      <button type="button" className="btn" onClick={onCancel}>
        Отмена
      </button>
    </form>
  );
};
