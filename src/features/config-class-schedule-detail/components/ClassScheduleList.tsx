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
          onClick={() => dispatch(changeSelectedDay("senin"))}
          className={`text-sm ${selected_day === "senin" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Senin</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("selasa"))}
          className={`text-sm ${selected_day === "selasa" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Selasa</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("rabu"))}
          className={`text-sm ${selected_day === "rabu" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Rabu</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("kamis"))}
          className={`text-sm ${selected_day === "kamis" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Kamis</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("jumat"))}
          className={`text-sm ${selected_day === "jumat" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Jumat</div>
        <div 
          onClick={() => dispatch(changeSelectedDay("sabtu"))}
          className={`text-sm ${selected_day === "sabtu" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Sabtu</div>
      </div>

      <ClassScheduleForm />
    </div>
  )
}

export default ClassScheduleList;