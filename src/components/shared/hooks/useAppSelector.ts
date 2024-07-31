import {useSelector} from 'react-redux';
import type {TypedUseSelectorHook} from 'react-redux';
import {RootState} from '../../../services/store/store';

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
