import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useState, Fragment } from 'react';
import { cn } from '@/lib/utils';

interface Option {
    id: number | string;
    label: string;
}

interface Props {
    options: Option[];
    value: number | string;
    onChange: (value: number | string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
}

export default function PremiumSelector({ options, value, onChange, placeholder = "Pilih...", label, error }: Props) {
    const [query, setQuery] = useState('');

    const selectedOption = options.find(opt => opt.id.toString() === value.toString());

    const filteredOptions = query === ''
        ? options
        : options.filter((opt) =>
            opt.label.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-1">
                    {label}
                </label>
            )}
            
            <Combobox value={selectedOption} onChange={(opt: Option | null) => opt && onChange(opt.id)}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-2xl bg-white border border-emerald-900/10 text-left shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                        <ComboboxInput
                            className="w-full border-none py-4 pl-12 pr-10 text-sm font-bold text-emerald-950 focus:ring-0 leading-5"
                            displayValue={(opt: Option) => opt?.label || ''}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={placeholder}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Search className="h-4 w-4 text-emerald-900/20" />
                        </div>
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDown className="h-4 w-4 text-emerald-900/20 hover:text-emerald-900" aria-hidden="true" />
                        </ComboboxButton>
                    </div>
                    
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <ComboboxOptions className="absolute z-[100] mt-2 max-h-60 w-full overflow-auto rounded-3xl bg-white py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm custom-scrollbar animate-in slide-in-from-top-2">
                            {filteredOptions.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-4 px-6 text-slate-500 italic">
                                    Tidak ditemukan.
                                </div>
                            ) : (
                                filteredOptions.map((opt) => (
                                    <ComboboxOption
                                        key={opt.id}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-3 pl-12 pr-4 transition-colors ${
                                                active ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
                                            }`
                                        }
                                        value={opt}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-black text-emerald-600' : 'font-bold'}`}>
                                                    {opt.label}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-600">
                                                        <Check className="h-4 w-4" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </ComboboxOption>
                                ))
                            )}
                        </ComboboxOptions>
                    </Transition>
                </div>
            </Combobox>
            
            {error && <p className="text-xs text-rose-500 font-bold mt-1 ml-1">{error}</p>}
        </div>
    );
}
