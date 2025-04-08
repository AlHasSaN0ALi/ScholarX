import { PiStudent } from "react-icons/pi";
import styles from './Services_2.module.css';
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";

export default function Section4() {
    return (
        <>
            <div className={styles.container}>

                <div className="mb-5">
                    <h1 className={`${styles.title} `}>Who We Help?</h1>
                    <p className={`text-muted ${styles.description} `}>Supporting diverse learners across different stages</p>
                </div>

                <div className="row">
                    <div className="col-md-3 col-sm-6">
                        <i><PiStudent className={`${styles.icon} `} /></i>
                        <h3>Students</h3>
                        <p className={`text-muted ${styles.description} `}>From high school
                        to university level</p>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <i><FaChalkboardTeacher className={`${styles.icon} `} /></i>
                        <h3>Educators</h3>
                        <p className={`text-muted ${styles.description} `}>Teachers and
                        academic professionals</p>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <i><FaBriefcase className={`${styles.icon} `} /></i>
                        <h3>Professionals</h3>
                        <p className={`text-muted ${styles.description} `}>Career changers
                        and skill seekers</p>
                    </div>
                    <div className="col-md-3 col-sm-6">
                        <i><FaBuilding className={`${styles.icon} `} /></i>
                        <h3>Institutions</h3>
                        <p className={`text-muted ${styles.description} `}>Schools and training
centers
</p>
                    </div>
                </div>
            </div>
        </>
    );
}