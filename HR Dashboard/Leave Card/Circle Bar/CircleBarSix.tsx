import { CircularProgressbar, buildStyles } from "react-circular-progressbar";


interface CircleProgressBarProps {
    percentageSix: number;
}

const CircleBarSix: React.FC<CircleProgressBarProps> = ({ percentageSix }) => {
    return (
        <div className='card shadow-sm p-3 rounded '>
            <div className="card-body ">
                <div className="row" >
                    <div className="d-flex justify-content-center">
                        <div className="Slider-progress">
                            <CircularProgressbar
                                value={percentageSix}
                                text="40/60"
                                styles={buildStyles({
                                    textColor: 'black',
                                    pathColor: '#FFFF99',
                                    trailColor: '#d6d6d6',
                                    textSize: 20,
                                })}
                            />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className=' d-flex flex-column p-5'>
                            <p className='card-label fw-bold fs-5 mb-1 '>Maternity Leave</p>
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

export default CircleBarSix;
