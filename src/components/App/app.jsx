import React from 'react';
import {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ButtonGroup, ButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle} from 'reactstrap';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import WeatherApi from '../../services/getWeather';
import Weather from './WeatherTable/weathertable';
import FutureWeather from './WeatherTable/futureWeather';
import './app.css';

const App = () => {
	const getWeather = new WeatherApi();

	// getWeather.getFutureCityWeather(53.90000, 27.56667);
	const [weather, setData] = useState({temp: 'loading',
		pressure: 'loading',
		humidity: 'loading',
		feelsLike: 'loading'}
	);
	
	const [futureWeather, setFutureWeather] = useState([]);

	const [city, setCity] = useState({city: 'Minsk',lat: 53.90000, lon: 27.56667});

	const [dropdownOpen, setToggle]= useState(false);

	useEffect(async ()=>{
		try{
			const {temp, pressure, humidity, feelsLike} = await getWeather.getCurrentCityWeather(city.city);
			setData({temp, pressure, humidity, feelsLike});
		} catch(e){
			setData({temp: 'Request Failed',
				pressure: 'Request Failed',
				humidity: 'Request Failed',
				feelsLike: 'Request Failed'});
		}
	}, [city]);

	useEffect(async ()=>{
		try{
			const futureTemp = await getWeather.getFutureCityWeather(city.lat, city.lon);
			console.log('This is me');
			setFutureWeather(futureTemp);
		} catch(e){
			setFutureWeather([]);
		}
	}, [city]);
	
	return (
		<Router>
			<div>
				<ButtonGroup>
					<Button onClick = {()=>{
						setCity({city: 'Minsk',lat: 53.90000, lon: 27.56667});
					}}>Minsk</Button>
					<Button onClick = {()=>{
						setCity({city: 'Brest',lat: 52.09755, lon: 23.68775});
					}}>Brest</Button>
					<ButtonDropdown isOpen={dropdownOpen} toggle={()=> setToggle(!dropdownOpen)}>
						<DropdownToggle caret>
						Other towns
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem onClick = {()=>{
								setCity({city: 'Vitebsk',lat: 55.19040, lon: 30.20490});
							}}>Vitebsk</DropdownItem>
							<DropdownItem onClick = {()=>{
								setCity({city: 'Homyel\'',lat: 52.43450, lon: 30.97540});
							}}>Homel</DropdownItem>
							<DropdownItem onClick = {()=>{
								setCity({city: 'Mahilyow',lat: 53.91680, lon: 30.34490});
							}}>Mogilev</DropdownItem>
							<DropdownItem onClick = {()=>{
								setCity({city: 'Hrodna',lat: 53.68840, lon: 23.82580});
							}}>Grodno</DropdownItem>
						</DropdownMenu>
					</ButtonDropdown>
				</ButtonGroup>
				<div className='app_links'>
					<h3 className='h3'>What you want to see: current weather or future weather?</h3>
					<Link className='btn btn-secondary' to='/'>Current weather</Link>
					<Link className='btn btn-secondary' to='/future'>Future weather</Link>	
				</div>
				<Route path='/' exact>
					<Weather data = {weather} city={city.city} header={`Current weather in ${city.city}`}/>
				</Route>
				<Route path='/future'>
					<FutureWeather weatherArr = {futureWeather} header={`Future weather in ${city.city}`} />
				</Route>
			</div>
		</Router>
	);
};

export default App;