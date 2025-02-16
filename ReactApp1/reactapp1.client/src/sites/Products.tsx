import {React,  useEffect, useState} from 'react';

interface Product {
    id?: number;
    name: string;
    price: string;
  }

const Products = () => {
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
    const [product, setProduct] = useState<Product|undefined>({
        name: "Test Post Product",
        price: "99.99"
    });
    useEffect(() => {
        populateWeatherData();
    }, []);
    const contents = products === undefined
    ? (
      <p>
        <em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em>
      </p>
    ) : (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                        </tr>
                    ))}
                </tbody>
      </table>
    );

  return (
    <div>
          <h1 id="tableLabel">Product prices</h1>
          <button onClick={postData}> Post Button</button>
      <p>This component fetches data from local database.</p>
      {contents}
    </div>
  );

  async function postData(){
      try {
          const token = localStorage.getItem("token");
          const response = await fetch("api/products", {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",  // Important for JSON payload
              },
              body: JSON.stringify(product),  // Convert product object to JSON
          });

          if (!response.ok) {
              throw new Error("Failed to add product");
          }

          const data = await response.json();
          console.log("Product added:", data);
      } catch (error) {
          console.error("Error:", error);
      }
  }

  async function populateWeatherData() {
      try {
          const token = localStorage.getItem("token");
          const response = await fetch('api/products', {
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
              }
          });
       if (response.ok) {
        const data: Product[] = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }

};

export default Products;