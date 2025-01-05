import { useEffect, useMemo, useState } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Autocomplete,
    AutocompleteProps,
    UseAutocompleteProps,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLazyFetchSuggestionsQuery } from '../../store/productApiSlice';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const SearchInput: React.FC = (props) => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [fetchSuggestions] = useLazyFetchSuggestionsQuery();
    const navigate = useNavigate();

    const handleTextFieldOnChange: React.ChangeEventHandler<
        HTMLInputElement
    > = (e) => {
        setSearchKeyword(e.target.value);
    };
    const debouncedFetchSuggestions = useMemo(
        () =>
            debounce(async (keyword) => {
                if (keyword.trim() === '') {
                    setSuggestions([]);
                    return;
                }
                const suggestions = await fetchSuggestions(keyword).unwrap();
                setSuggestions(suggestions);
            }, 300),
        [fetchSuggestions]
    );

    const handleClickSearch = () => {
        if (searchKeyword) {
            navigate(`/?title=${searchKeyword}&page=1`);
        } else {
            navigate('/');
        }
    };

    const handleAutoCompleteChange = (
        event: React.SyntheticEvent,
        value: string | null
    ) => {
        setSearchKeyword(value || '');
        if (value) {
            navigate(`/?title=${value}&page=1`);
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement> & {
            defaultMuiPrevented?: boolean;
        }
    ) => {
        if (event.key === 'Enter') {
            // Prevent's default 'Enter' behavior.
            event.defaultMuiPrevented = true;
            if (searchKeyword) {
                navigate(`/?title=${searchKeyword}&page=1`);
            } else {
                navigate('/');
            }
        }
    };

    useEffect(() => {
        debouncedFetchSuggestions(searchKeyword);
    }, [searchKeyword, debouncedFetchSuggestions]);

    return (
        <Autocomplete
            id='search'
            freeSolo
            onChange={handleAutoCompleteChange}
            sx={{ width: '60%' }}
            options={suggestions}
            onKeyDown={handleKeyDown}
            renderInput={(params) => (
                <TextField
                    {...params}
                    aria-label='search'
                    variant='outlined'
                    size='small'
                    onChange={handleTextFieldOnChange}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <InputAdornment position='end'>
                                <IconButton
                                    onClick={handleClickSearch}
                                    color='primary'
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                        style: { paddingRight: 0 },
                    }}
                />
            )}
        />
    );
};

export default SearchInput;
