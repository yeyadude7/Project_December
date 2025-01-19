import React, { useCallback, useEffect, useState } from 'react';

import Modal from '../modal.jsx';
import Config from "../../../config.js";

import Textbox from "../../Textbox/textbox.jsx";
import Checkbox from "../../Checkbox/checkbox.jsx";
import Button from "../../Button/button.jsx";

function SignupModal(props) {
    const [index, setIndex] = useState(0);
    const [form, setForm] = useState({});

    const currentPage = () => {
        switch (index) {
            case 0: return <EmailPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 1: return <VerifyEmailPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 2: return <NamePage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 3: return <GoalsInterestsPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 4: return <StudentTypePage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 5: return <YearPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 6: return <SocialPreferencePage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 7: return <MajorPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 8: return <PasswordPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;
            case 9: return <FinishPage form={form} onSubmit={handleSubmit} onUpdateForm={onUpdateForm} />;

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
        if (index > 9) {
            props.handleClose();
        }
    }, [index, props.handleClose]);

    return (
        <Modal show={props.show} handleClose={props.handleClose} title="Create an Account">
            {currentPage()}
        </Modal>
    );
}

function EmailPage(props) {
    const [email, setEmail] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        // Verify email is proper form
        if (!emailIsValid)
            return;
        
        setEmail(event.target.value);
        props.form.email = event.target.value;
    };

    const emailIsValid = (email) => {
        const regex = /^[\w-\.]+@ucf.edu$/;
        const isValid = regex.test(email);

        return isValid;
    };

    useEffect(() => {
        setCanContinue(emailIsValid(email));
    }, [email]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <Textbox name="email" label="What's your email?" description="Please enter your UCF email to get started" onChange={handleChange} />
            <Button text="Continue" active={canContinue} />
        </form>
    );
}

function VerifyEmailPage(props) {
    const [verificationCode, setVerificationCode] = useState(0);
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        if (!isNumber(event.target.value))
            return;

        setVerificationCode(event.target.value);
        props.form.verifyEmail = event.target.value;
    };

    const isNumber = (number) => {
        return !isNaN(parseFloat(number)) && !isNaN(number - 0);
    };

    useEffect(() => {
        setCanContinue(verificationCode.toString().length === 6)
    }, [verificationCode]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };
    
    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <Textbox name="verifyEmail" label="Verify your email" description={`We've sent a 6-digit code to ${props.form.email}`} onChange={handleChange} />
            <Button text="Continue" active={canContinue} />
        </form>
    );
}

function NamePage(props) {
    const [name, setName] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        setName(event.target.value);
        props.form.name = event.target.value;
    };

    useEffect(() => {
        setCanContinue(name.length > 0)
    }, [name]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <Textbox name="name" label="What's your name?" description="This is how you'll appear to others" onChange={handleChange} />
            <Button text="Continue" active={canContinue} />
        </form>
    );
}

function GoalsInterestsPage(props) {
    const [allInterests, setAllInterests] = useState([]);
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
        const fetchFromURL = async () => {
            const request = await fetch(`${window.location.protocol}//${window.location.hostname}:${Config.SERVER_PORT}/api/interest/all`);
            const response = await request.json();

            let tmp = [];

            response.map((element) => {
                tmp.push(element.name);
            });

            setAllInterests(tmp);
        };

        fetchFromURL();
    }, []);

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

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

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

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-[1rem] w-full gap-[0.5rem]">
                <label className="text-xl font-bold" htmlFor="goal">What's your main goal?</label>
                <div className="gap-4 grid grid-cols-1">
                    {allGoals.map((element, key) => {
                        return <Checkbox key={key} name={element.goal.toLowerCase()} displayName={element.goal} active={mainGoal === element.goal.toLowerCase()} description={element.description} handleClick={(event) => handleGoalClick(event, element.goal.toLowerCase())} />
                    })}
                </div>
            </div>
            <div className="flex flex-col mb-[1rem] w-full gap-[0.5rem]">
                <label className="text-xl font-bold" htmlFor="interests">What are your interests?</label>
                <p className="text-sm text-zinc-600">Choose up to 3</p>
                <div className="gap-4 grid grid-cols-4">
                    {!allInterests ? null : allInterests.map((element, key) => {
                        return <Checkbox key={key} name={element.toLowerCase()} displayName={element} active={interests[element.toLowerCase()]} handleClick={(event) => handleInterestClick(event, element.toLowerCase())} />;
                    })}
                </div>
            </div>
            <Button text="Continue" active={canContinue} />
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
    };

    useEffect(() => {
        setCanContinue(studentType);
    }, [studentType]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    const allStudentTypes = [
        "Undergraduate",
        "Graduate",
        "Alumni",
    ];

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-[1rem] w-full gap-[0.5rem]">
                <label className="text-xl font-bold" htmlFor="studentType">What type of student are you?</label>
                <div className="gap-4 grid grid-cols-1">
                    {allStudentTypes.map((element, key) => {
                        return <Checkbox key={key} name={element.toLowerCase()} displayName={element} active={studentType === element} handleClick={(event) => handleClick(event, element)} />;
                    })}
                </div>
            </div>
            <Button text="Continue" active={canContinue} />
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
    };

    useEffect(() => {
        setCanContinue(year);
    }, [year]);

    const allYears = [
        "Freshman",
        "Sophomore",
        "Junior",
        "Senior",
        "Graduate",
    ];

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-[1rem] w-full gap-[0.5rem]">
                <label className="text-xl font-bold" htmlFor="year">What year are you?</label>
                <div className="gap-4 grid grid-cols-2">
                    {allYears.map((element, key) => {
                        return <Checkbox key={key} name={element.toLowerCase()} displayName={element} active={year === element} handleClick={(event) => handleClick(event, element)} />;
                    })}
                </div>
            </div>
            <Button text="Continue" active={canContinue} />
        </form>
    );
}

function MajorPage(props) {
    const [major, setMajor] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        setMajor(event.target.value);
        props.form.major = event.target.value;
    }

    useEffect(() => {
        setCanContinue(major.length > 0);
    }, [major]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-[1rem] w-full gap-[0.5rem]">
                <Textbox name="major" label="What's your major?" onChange={handleChange} />
            </div>
            <Button text="Continue" active={canContinue} />
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
    }

    useEffect(() => {
        setCanContinue(socialPreference);
    }, [socialPreference]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <div className="flex flex-col mb-[1rem] w-full gap-[0.5rem]">
                <label className="text-xl font-bold" htmlFor="year">Do you typically prefer?</label>
                <div className="gap-4 grid grid-cols-1">
                    {allSocialPreferences.map((element, key) => {
                        return <Checkbox key={key} name={element.preference.toLowerCase()} displayName={element.preference} description={element.description} active={socialPreference === element.preference.toLowerCase()} handleClick={(event) => handleClick(event, element.preference.toLowerCase())} />;
                    })}
                </div>
            </div>
            <Button text="Continue" active={canContinue} />
        </form>
    );
}

function PasswordPage(props) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [canContinue, setCanContinue] = useState(false);

    const handleChange = (event) => {
        event.preventDefault();

        switch (event.target.name) {
            case "password":
                setPassword(event.target.value);
                props.form.password = event.target.value;
                break;
            case "confirmPassword":
                setConfirmPassword(event.target.value);
                break;
        }
    }

    useEffect(() => {
        setCanContinue(password === confirmPassword && password.length > 0);
    }, [password, confirmPassword]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (canContinue)
            props.onSubmit(event);
    };

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={handleSubmit}>
            <Textbox name="password" label="Password" description="Try to avoid easy to guess passwords" onChange={handleChange} />
            <Textbox name="confirmPassword" label="Confirm Password" onChange={handleChange} />
            {!canContinue ? <p className="text-red-500 text-sm">Passwords do not match</p> : null}
            <Button text="Continue" active={canContinue} />
            </form>
    );
}

function FinishPage(props) {
    useEffect(() => {
        const postRegister = async () => {
            const request = await fetch(`${window.location.protocol}//${window.location.hostname}:${Config.SERVER_PORT}/api/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: props.form.name,
                    email: props.form.email,
                    password: props.form.password,
                    major: props.form.major,
                    goal: 0,
                    photo: "",
                    type_of_student: props.form.studentType,
                    year: props.form.year,
                    group_preference: props.form.socialPreference
                })
            });
            const response = await request.json();
        };

        postRegister();
    }, []);

    return (
        <form className="flex flex-col justify-center items-center mw-[70%]" target="_self" action="" onSubmit={props.onSubmit}>
            <div className="m-4 text-center">
                <h1 className="text-2xl">Welcome, {props.form.name}!</h1>
                <h2>You're all signed up for Project January.</h2>
            </div>
            <Button text="Continue" active={true} />
        </form>
    );
}

export default SignupModal;