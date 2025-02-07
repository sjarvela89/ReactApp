import {React,  useEffect, useState} from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
  }

const Products = () => {
    const [products, setProducts] = useState<Product[] | undefined>(undefined);
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
      <p>This component fetches data from local database.</p>
      {contents}
    </div>
  );

  async function populateWeatherData() {
    try {
        const response = await fetch('api/products');
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