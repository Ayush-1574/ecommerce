



export const addProductFormElements = [
  {
    name: "title",
    label: "Product Title",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  {
    name: "price",
    label: "Original Price (₹)",
    type: "number",
    required: true,
  },
  {
    name: "salePrice",
    label: "Sale Price (₹)",
    type: "number",
    required: false,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      {
        label: "Electronics",
        value: "electronics",
        subcategories: [
          { label: "Phones", value: "phones" },
          { label: "Laptops", value: "laptops" },
          { label: "Cameras", value: "cameras" },
        ],
      },
      {
        label: "Fashion",
        value: "fashion",
        subcategories: [
          { label: "Men", value: "men" },
          { label: "Women", value: "women" },
          { label: "Kids", value: "kids" },
        ],
      },
      {
        label: "Home",
        value: "home",
        subcategories: [
          { label: "Furniture", value: "furniture" },
          { label: "Kitchen", value: "kitchen" },
          { label: "Decor", value: "decor" },
        ],
      },
    ],
  },
  {
    name: "brand",
    label: "Brand",
    type: "select",
    required: true,
    multiple: true,
    options: [
      { label: "Apple", value: "apple" },
      { label: "Samsung", value: "samsung" },
      { label: "Nike", value: "nike" },
      { label: "Sony", value: "sony" },
      { label: "Adidas", value: "adidas" },
    ],
  },
  {
    name: "totalStocks",
    label: "Total Stocks",
    type: "number",
    required: true,
  },
  {
    name: "image",
    label: "Product Image",
    type: "file",
    required: true,
  },
];
