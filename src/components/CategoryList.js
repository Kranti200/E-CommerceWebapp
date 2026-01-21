import React, { useEffect, useState } from "react";
import axios from "axios";

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      <h2>Categories</h2>
      <ul className="list-group">
        {categories.map((c) => (
          <li key={c.id} className="list-group-item">{c.category}</li>
        ))}
      </ul>
    </div>
  );
}
export default CategoryList;
