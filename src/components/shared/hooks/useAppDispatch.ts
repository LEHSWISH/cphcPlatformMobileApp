import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../services/store/store';

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;
