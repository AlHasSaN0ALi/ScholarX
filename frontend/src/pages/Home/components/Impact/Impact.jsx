
import styles from './Impact.module.css';


export default function Impact() {
    return (
        <>

            <div className={styles.container}>

                <div className="mb-5">
                    <h1 className={`${styles.title} `}>Our Impact                    </h1>
                </div>

                <div className="row">
                    <div className="col-md-3 col-sm-6">
                    <h1 className={`${styles.title} `}>50,000+</h1>
                        <p className={` ${styles.description} `}>Students Supported
                        </p>
                    </div>
                    <div className="col-md-3 col-sm-6">
                    <h1 className={`${styles.title} `}>1,000+</h1>
                        <p className={` ${styles.description} `}>Expert Mentors</p>
                    </div>
                    <div className="col-md-3 col-sm-6">
                    <h1 className={`${styles.title} `}>95%</h1>
                        <p className={` ${styles.description} `}>Success Rate</p>
                    </div>
                    <div className="col-md-3 col-sm-6">
                    <h1 className={`${styles.title} `}>200+</h1>
                        <p className={` ${styles.description} `}>Partner Institutions</p>
                    </div>
                </div>
            </div>


        </>
    );
}
