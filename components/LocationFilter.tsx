"use client";
import qs from  'query-string';
import { useEffect, useState } from "react";
import Container from "./Container";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from './ui/button';

const LocationFilter = () => {
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const countryStates = getCountryStates(country);
    if (countryStates) {
      setStates(countryStates);
      setState("");
      setCity("");
    }
  }, [country]);
  useEffect(() => {
    const stateCities = getStateCities(country, state);
    if (stateCities) {
      setCities(stateCities);
      setCity("");
    }
  }, [country, state]);
  useEffect(() => {
    if (country === "" && state === "" && city === "") router.push("/");

    let currentQuery: any = {};
    if(params) {
        currentQuery = qs. parse(params.toString());
    }
    if(country) {
        currentQuery = {
            ...currentQuery ,
            country
        }
    }
    if(state) {
        currentQuery = {
            ...currentQuery ,
            state
        }
    }
    if(city) {
        currentQuery = {
            ...currentQuery ,
            city
        }
    }
    if(state=== ''&& currentQuery.state) {
        delete currentQuery.state
    }
    if(city=== ''&& currentQuery.city) {
        delete currentQuery.city
    }
    const url = qs.stringifyUrl({
        url:'/',
        query: currentQuery
    }, {skipNull:true,  skipEmptyString: true});
    router.push(url)
  }, [country, state, city]);

  const handleClear =  ()=>{
    router.push("/")
    setCountry('')
    setState("")
    setCity("")
  }

  const hasFilters = country || state || city;

  return (
    <Container>
      <div className="py-4 border-b border-border/40">
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <div className="flex-1 min-w-[150px] max-w-[200px]">
            <Select onValueChange={(value) => setCountry(value)} value={country}>
              <SelectTrigger className="bg-background h-10">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => {
                  return (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[150px] max-w-[200px]">
            <Select onValueChange={(value) => setState(value)} value={state} disabled={!country}>
              <SelectTrigger className="bg-background h-10">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {states.length > 0 &&
                  states.map((state) => {
                    return (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[150px] max-w-[200px]">
            <Select onValueChange={(value) => setCity(value)} value={city} disabled={!state}>
              <SelectTrigger className="bg-background h-10">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                {cities.length > 0 &&
                  cities.map((city) => {
                    return (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          {hasFilters && (
            <Button 
              onClick={() => handleClear()} 
              variant="outline"
              size="sm"
              className="h-10"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};

export default LocationFilter;
