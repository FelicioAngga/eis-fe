import ClassScheduleForm from './ClassScheduleForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { changeSelectedDay } from '../configClassScheduleSlice';

function ClassScheduleList() {
  const dispatch = useDispatch();
  const { selected_day } = useSelector((state: RootState) => state.configClassSched);

  return (
    <div className="mt-8">
      <div className="flex gap-5">
        <div 
          onClick={() => dispatch(changeSelectedDay("Monday"))}
          className={`text-sm ${selected_day === "Monday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Senin</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("Tuesday"))}
          className={`text-sm ${selected_day === "Tuesday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Selasa</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("Wednesday"))}
          className={`text-sm ${selected_day === "Wednesday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Rabu</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("Thursday"))}
          className={`text-sm ${selected_day === "Thursday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Kamis</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("Friday"))}
          className={`text-sm ${selected_day === "Friday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Jumat</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("Saturday"))}
          className={`text-sm ${selected_day === "Saturday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Sabtu</div>
      </div>

      <ClassScheduleForm />
    </div>
  )
}

export default ClassScheduleList;