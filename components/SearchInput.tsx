'use client'
import qs from 'query-string'
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEventHandler, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDebounceValue } from '@/hooks/useDebounceValue';

const SearchInput = () => {
    const searchParams = useSearchParams()
    const title = searchParams.get("title") 

    const [value, setValue] = useState(title || '')
    const pathname = usePathname()
    const router = useRouter()

    const debouncevalue = useDebounceValue <string> (value)

    useEffect(() => {
        const  query = {
            title: debouncevalue

        }
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, {
            skipNull:true, skipEmptyString:true
        })
        console.log("url", url);

     router.push(url)
    }, [debouncevalue, router]);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e)=> {
        setValue(e.target.value)
    }
    if(pathname !== '/') return null
    return ( <div className="relative sm:block hidden">
        <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground"/>
        <Input value={value} onChange={onChange} placeholder="Search"  className="pl-10 bg-primary/10"/>
    </div> );
}
 
export default SearchInput;