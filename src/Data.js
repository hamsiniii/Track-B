// Data.js

const fetchData = async () => {
    const promises = Array.from({ length: 6 }, (_, i) =>
      fetch(`http://localhost:5000/artist/image/${i + 8}`).then((response) => response.json())
    );
  
    try {
      const results = await Promise.all(promises);
  
      const data = results.map((result, index) => ({
        id: index + 1,
        name: `artist${index + 1}`,  
        img: `data:image/jpeg;base64,${result.image}`, 
        matched: false,
      }));
  
      return [...data, ...data.map((item, i) => ({ ...item, id: i + 7 }))];
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  
  const Data = fetchData();
  export default Data;
  