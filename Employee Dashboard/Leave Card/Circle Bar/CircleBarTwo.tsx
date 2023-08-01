import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import '..//..//..//..//Qs_css/Autocomplete.css'
interface CircleProgressBarProps {
    percentagetwo: number;
    leavecondays: number;
    leavetotal: number;
    leavebl: number;
}


const CircleBarTwo: React.FC<CircleProgressBarProps> = ({ percentagetwo, leavecondays, leavetotal, leavebl })=> {
    return (
        <div className='card shadow-sm p-3 rounded'>
            <div className="card-body " >
                <div className="row" >

                    <div className="d-flex justify-content-center">
                        <div style={{ width: '90px' }}>
                            <CircularProgressbar
                                value={percentagetwo}
                                text={leavecondays + "/" + leavetotal}
                                styles={buildStyles({
                                    textColor: 'black',
                                    pathColor: 'green',
                                    trailColor: '#d6d6d6',
                                    textSize: 20,

                                })}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className=' d-flex flex-column p-5'>
                            <p className='card-label fw-bold fs-5 mb-1 text-dark'>Annual Leave</p>
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

export default CircleBarTwo;
