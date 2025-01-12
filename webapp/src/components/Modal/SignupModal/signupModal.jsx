import React, { useCallback, useEffect, useState } from 'react';

import Modal from '../modal.jsx';
import './signupModal.css';

function SignupModal(props) {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState({});

    const currentPage = () => {
        switch (index) {
            case 0: return <SignupEmailPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 1: return <VerifyEmailPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 2: return <NamePage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 3: return <GoalsInterestsPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 4: return <StudentTypePage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 5: return <YearPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 6: return <SocialPreferencePage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 7: return <FinishPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />

            default: return null;
        }
    };

    const onUpdateForm = useCallback((updatedForm) => {
        setForm(prevForm => ({
            ...form,
            ...updatedForm
        }));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setIndex(i => i + 1);
    };

    useEffect(() => {
        if (index >= 8) {
            props.handleClose();
        }
    }, [index, props.handleClose]);

    return (
        <Modal show={props.show} handleClose={props.handleClose} title="Create an Account">
            {currentPage()}
        </Modal>
    );
}

function SignupEmailPage(props) {
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        props.form.email = event.target.value;

        if (props.form.email.length > 0)
            setCanContinue(true);
    };

    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="email">What's your email?</label>
                <p className="input-group-description">Please enter your UCF email to get started</p>
                <input type="text" id="email" name="email" onChange={handleChange}></input>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function VerifyEmailPage(props) {
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        props.form.verifyEmail = event.target.value;

        if (props.form.verifyEmail.length === 6)
            setCanContinue(true);
    };
    
    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="verifyEmail">Verify your email</label>
                <p className="input-group-description">We've sent a 6-digit code to {props.form.email}</p>
                <input type="text" id="verifyEmail" name="verifyEmail" onChange={handleChange}></input>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function NamePage(props) {
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        props.form.name = event.target.value;

        if (props.form.name.length > 0)
            setCanContinue(true);
    };

    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="name">What's your name?</label>
                <p className="input-group-description">This is how you'll appear to others</p>
                <input type="text" id="name" name="name" onChange={handleChange}></input>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function GoalsInterestsPage(props) {
    const [interests, setInterests] = useState({});
    const [mainGoal, setMainGoal] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleGoalClick = (event, goal) => {
        event.preventDefault();

        setMainGoal(goal);
        props.form.goal = goal;
    };

    const handleInterestClick = (event, interest) => {
        event.preventDefault();

        setInterests(prevInterests => {
            const updatedInterests = {
                ...prevInterests,
                [interest]: !prevInterests[interest]
            };

            return updatedInterests;
        });

        props.form.interests = interests;
    }

    useEffect(() => {
        const hasSelectedInterest = Object.values(interests).some(x => x);
        setCanContinue(mainGoal && hasSelectedInterest);

    }, [interests, mainGoal]);

    useEffect(() => {
        const syncForm = () => {
            props.onUpdateForm({
                interests: interests,
                goal: mainGoal
            });
        };
    }, [interests, mainGoal, props.onUpdateForm]);

    const allGoals = [
        {
            goal: "Academic Networking",
            description: "Connect with classmates and study partners"
        },
        {
            goal: "Social Connections",
            description: "Make new friends with similar interests"
        },
        {
            goal: "Hobby Groups",
            description: "Find people that share your passions"
        },
        {
            goal: "Professional Growth",
            description: "Build your professional network"
        }
    ]

    const allInterests = [
        "Academics",
        "Tech",
        "Arts",
        "Sports",
        "Music",
        "Literature",
        "Culture",
        "Games",
        "Photography"
    ]

    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="goal">What's your main goal?</label>
                <div className="input-checkbox-container grid grid-cols-1">
                    {allGoals.map((element, key) => {
                        return <Checkbox key={key} name={element.goal.toLowerCase()} displayName={element.goal} active={mainGoal === element.goal.toLowerCase()} description={element.description} handleClick={(event) => handleGoalClick(event, element.goal.toLowerCase())} />
                    })}
                </div>
            </div>
            <div className="input-group">
                <label htmlFor="interests">What are your interests?</label>
                <p className="input-group-description">Choose up to 3</p>
                <div className="input-checkbox-container grid grid-cols-4">
                    {allInterests.map((element, key) => {
                        return <Checkbox key={key} name={element.toLowerCase()} displayName={element} active={interests[element.toLowerCase()]} handleClick={(event) => handleInterestClick(event, element.toLowerCase())} />;
                    })}
                </div>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function StudentTypePage(props) {
    const [studentType, setStudentType] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleClick = (event, studentType) => {
        event.preventDefault();

        setStudentType(studentType);
        props.form.studentType = studentType;

        if (studentType)
            setCanContinue(true);
    };

    const allStudentTypes = [
        "Undergraduate",
        "Graduate",
        "Alumni",
    ];

    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="studentType">What type of student are you?</label>
                <div className="input-checkbox-container grid grid-cols-1">
                    {allStudentTypes.map((element, key) => {
                        return <Checkbox key={key} name={element.toLowerCase()} displayName={element} active={studentType === element} handleClick={(event) => handleClick(event, element)} />;
                    })}
                </div>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function YearPage(props) {
    const [year, setYear] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleClick = (event, year) => {
        event.preventDefault();

        setYear(year);
        props.form.year = year;

        if (year)
            setCanContinue(true);
    };

    const allYears = [
        "Freshman",
        "Sophomore",
        "Junior",
        "Senior",
        "Graduate",
    ];

    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="year">What year are you?</label>
                <div className="input-checkbox-container grid grid-cols-2">
                    {allYears.map((element, key) => {
                        return <Checkbox key={key} name={element.toLowerCase()} displayName={element} active={year === element} handleClick={(event) => handleClick(event, element)} />;
                    })}
                </div>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function SocialPreferencePage(props) {
    const [socialPreference, setSocialPreference] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const allSocialPreferences = [
        {
            preference: "Large group events",
            description: "Conferences, festivals, large meetups"
        },
        {
            preference: "Small gatherings",
            description: "Study groups, coffee chats, small meetups"
        },
        {
            preference: "Mix of both",
            description: "Flexible depending on the occasion"
        }
    ]

    const handleClick = (event, preference) => {
        event.preventDefault();

        setSocialPreference(preference);
        props.form.socialPreference = preference;

        if (preference) 
            setCanContinue(true);
    }

    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="input-group">
                <label htmlFor="year">Do you typically prefer?</label>
                <div className="input-checkbox-container grid grid-cols-1">
                    {allSocialPreferences.map((element, key) => {
                        return <Checkbox key={key} name={element.preference.toLowerCase()} displayName={element.preference} description={element.description} active={socialPreference === element.preference.toLowerCase()} handleClick={(event) => handleClick(event, element.preference.toLowerCase())} />;
                    })}
                </div>
            </div>
            {canContinue ? <button>Continue</button> : null}
        </form>
    );
}

function FinishPage(props) {
    return (
        <form className="modalForm" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="m-4 text-center">
                <h1 className="text-2xl">Welcome, {props.form.name}!</h1>
                <h2>You're all signed up for Project January.</h2>
            </div>
            <button>Finish Registration</button>
        </form>
    );
}

function Checkbox(props) {
    return (
        <div onClick={props.handleClick} className={"input-checkbox " + (props.active ? "active" : "")}>
            <input type="button" name={props.name} value={props.displayName}/>
            {props.description ? <label htmlFor={props.name}>{props.description}</label> : null}
        </div>
    );
}

export default SignupModal;