import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import '..//..//..//..//Qs_css/Autocomplete.css'

interface CircleProgressBarProps {
    percentagefour: number;
    leavecondays:number;
    leavetotal:number;
    leavebl:number;
}

const CircleBarFour: React.FC<CircleProgressBarProps> = ({ percentagefour, leavecondays, leavetotal, leavebl }) => {
    return (
        <div className='card shadow-sm p-3  rounded'>
        <div className="card-body " >
            <div className="row" >

                <div className="d-flex justify-content-center">
                    <div style={{ width: '90px' }}>
                        <CircularProgressbar
                            value={percentagefour}
                            text={leavecondays + "/" + leavetotal}

                            styles={buildStyles({
                                textColor: 'black',
                                pathColor: 'red',
                                trailColor: '#d6d6d6',
                                textSize: 20,

                            })}
                        />
                    </div>
                </div>
                <div className="text-center">
                    <div className=' d-flex flex-column p-5'>
                        <p className='card-label fw-bold fs-5 mb-1 text-dark'>Earned Leave</p>
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

export default CircleBarFour;
