import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


// Define TypeScript types for the fetched data
interface CarData {
  vin: string;
  country: string;
  manufacturer: string;
  region: string;
  years: number[];
}

function App() {
  const [searchData, setSearchData] = useState('');
  const [carData, setCarData] = useState<CarData | null>(null); // State to store the fetched car data
  const [options, setOptions] = useState<string[]>([]); // State to store the Autocomplete options
  const [selectedModal, setSelectedModal] = useState<string>('');
  const [carModal, setCarModal] = useState([]);
  const [cars, setCars] = useState([]);
  const [carDetails, setCarDetails] = useState()
  const [toggleState,setToggleState] = useState(false)

  const fetchData = async () => {
    try {
      const response = await axios.get<CarData>(`https://api.api-ninjas.com/v1/vinlookup?vin=${searchData}`, {
        headers: {
          'X-Api-Key': '2bljrtZK68k9jItHBQpMqg==w39JtJtYjtQeZOiX',
        }
      });
      setCarData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };





  const fetchModal = async () => {
    try {
      if (carData) {
        const response = await axios.get<CarData>(`https://api.api-ninjas.com/v1/cars?limit=100&make=${carData.manufacturer}`, {
          headers: {
            'X-Api-Key': '2bljrtZK68k9jItHBQpMqg==w39JtJtYjtQeZOiX',
          }
        });
        const updateArray = response.data.map((i) => {
          return i.model;
        });

        setOptions(updateArray);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  const handleSlectedModal = async () => {
    try {
      const response = await axios.get<CarData>(`https://api.api-ninjas.com/v1/cars?limit=100&make=${carData?.manufacturer}&model=${selectedModal}`, {
        headers: {
          'X-Api-Key': '2bljrtZK68k9jItHBQpMqg==w39JtJtYjtQeZOiX',
        }
      });
setToggleState(true)

      setCars(response.data)
    } catch (err) {

    }
  }


  useEffect(() => {
    handleSlectedModal()
  }, [selectedModal])



  // Function to handle Autocomplete input change
  const handleAutoCompleteChange = async (event: React.ChangeEvent<{}>, value: string | null) => {
    if (value) {
      setSelectedModal(value);
    }
  };

  // Function to handle input change
  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData(event.target.value);
  };

  useEffect(() => {
    fetchModal()
  }, [carData])

  return (
    <div className='flex items-center justify-center flex-col h-[100vh] w-[100vw]'>
      {toggleState ? <div className='bg-white shadow-lg h-full w-[100%] m-auto rounded-lg p-10'>
     <div className='flex items-end justify-end my-2'>
     <IconButton onClick={()=>setToggleState(false)}>
       <CloseIcon />
       </IconButton>
     </div>
      <div className='overflow-x-auto'>
  <table className='min-w-full divide-y divide-gray-200'>
    <thead className='bg-gray-50'>
      <tr>
        {["City Milage", "Highway MPG", "Combination Milage", "Cylenders", "Drive", "Fuel Type", "Manufacturer", "Modal", "Transmission", "Year"].map((item, index) => (
          <th key={index} scope="col" className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
            {item}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className='bg-white divide-y divide-gray-200'>
      {cars.map((item, index) => (
        <tr key={index}>
          <td className='px-6 py-4 whitespace-nowrap'>{item.city_mpg}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.highway_mpg}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.combination_mpg}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.cylinders}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.drive}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.fuel_type}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.make}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.model}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.transmission}</td>
          <td className='px-6 py-4 whitespace-nowrap'>{item.year}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

   

      </div> : <div className='bg-white shadow-lg rounded-lg p-10'>
        {/* New input field */}
        <input placeholder='Vin Number' className='px-5 py-2 border ' style={{
          marginBottom: 20
        }} value={searchData} onChange={handleInputChange} />
        <Button onClick={fetchData}>Search</Button>
        {/* Material-UI Autocomplete component */}
        <TextField
          fullWidth
          value={carData?.manufacturer || ''}
          style={{
            marginBottom: 10
          }}
          label="Manufacturer"
          variant="outlined"
        />
        <Autocomplete
          options={options}
          freeSolo
          value={selectedModal}
          onSelect={(e) => {
            setSelectedModal(e.target.value)
          }}
          fullWidth
          onChange={handleAutoCompleteChange}
          renderInput={(params) => (
            <TextField
              fullWidth
              {...params}
              label="Model"
              variant="outlined"
            />
          )}
        />



      </div>}
    </div>
  );
}

export default App;
