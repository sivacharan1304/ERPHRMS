import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import '..//..//..//..//Qs_css/Autocomplete.css'

interface CircleProgressBarProps {
    percentageone: number;
    leavecondays:number;
    leavetotal:number;
    leavebl:number;
}

const CircleBarOne: React.FC<CircleProgressBarProps> = ({ percentageone,leavecondays,leavetotal,leavebl })=> {
    return (
        <div className='card shadow-sm p-3  rounded'>
            <div className="card-body ">
                <div className="row" >
                    <div className="d-flex justify-content-center">
                        <div className="Slider-progress">
                            <CircularProgressbar
                                value={percentageone}
                                // text="30/60"
                                text={leavecondays + "/" + leavetotal}
                                styles={buildStyles({
                                    textColor: 'black',
                                    pathColor: 'blue',
                                    trailColor: '#d6d6d6',
                                    textSize: 20,
                                })}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className=' d-flex flex-column p-5'>
                            <p className='card-label fw-bold fs-5 mb-1 text-dark' >Sick Leave</p>
                            {/* <p className='text-black fw-semibold fs-6 '>
                                {leavebl}
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CircleBarOne;




