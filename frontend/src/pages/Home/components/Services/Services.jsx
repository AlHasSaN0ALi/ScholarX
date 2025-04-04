import { IoMdCheckmark } from "react-icons/io";
import styles from './Services.module.css'

export default function Service() {
    return (
        <>
            <div className={`${styles.container} py-5 `}>
                <div className="my-5 ">
                    <h1 className="text-center">why choose scholarx?</h1>
                </div>

                <div className="row">


                    <div className="col-md-6 ">


                        <ul className="list-unstyled ms-5">
                            <li className="mb-4">
                                <div className="d-flex" >
                                    <div className="me-3">
                                        <IoMdCheckmark className={`${styles.icon}`} />
                                    </div>
                                    <div className="text-start" >
                                        <h5 >Comprehensive Resources</h5>
                                        <p>Access a wealth of information, including university rankings, program details, campus life insights, and scholarship opportunities, all in one place.</p>
                                    </div>
                                </div>
                            </li>
                            <li className="mb-4">
                                <div className="d-flex" >
                                    <div className="me-3">
                                        <IoMdCheckmark className={`${styles.icon}`} />
                                    </div>
                                    <div className="text-start">
                                        <h5 >Personalized Learning Path
                                        </h5>
                                        <p>Tailored academic support based on your unique needs and goals.
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="mb-4">
                                <div className="d-flex" >
                                    <div className="me-3">
                                        <IoMdCheckmark className={`${styles.icon}`} />
                                    </div>
                                    <div className="text-start" >
                                        <h5 >Flexible Schedule</h5>
                                        <p>iysical system</p>
                                    </div>
                                </div>
                            </li>
                            <li className="mb-4">
                                <div className="d-flex" >
                                    <div className="me-3">
                                        <IoMdCheckmark className={`${styles.icon}`} />
                                    </div>
                                    <div className="text-start">
                                        <h5 >Expert Network</h5>
                                        <p>Connect with verified professionals from top institutions.
                                        </p>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>

                    <div className="col-md-6">
                        <div>
                            <img className={`${styles.imgResponsive} ${styles.imgShadow}`} src="service.png" alt="" />
                        </div>

                    </div>



                </div>



            </div>
        </>
    );
}
