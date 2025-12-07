'use client'
import qs from 'query-string'
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { ChangeEventHandler, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDebounceValue } from '@/hooks/useDebounceValue';
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const SearchInput = () => {
    const searchParams = useSearchParams()
    const title = searchParams.get("title") 

    const [value, setValue] = useState(title || '')
    const pathname = usePathname()
    const router = useRouter()

    const debouncevalue = useDebounceValue <string> (value)

    useEffect(() => {
        const query = {
            title: debouncevalue
        }
        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, {
            skipNull: true, 
            skipEmptyString: true
        })

        router.push(url)
    }, [debouncevalue, router]);

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value)
    }

    const clearSearch = () => {
        setValue('')
        router.push('/')
    }

    if(pathname !== '/') return null
    
    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute h-4 w-4 top-1/2 left-4 -translate-y-1/2 text-muted-foreground pointer-events-none"/>
            <Input 
                value={value} 
                onChange={onChange} 
                placeholder="Search hotels..."  
                className="pl-10 pr-10 h-10 bg-background border-border focus-visible:ring-primary"
            />
            <AnimatePresence>
                {value && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={clearSearch}
                        >
                            <X className="h-3.5 w-3.5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
 
export default SearchInput;