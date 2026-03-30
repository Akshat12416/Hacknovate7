export interface FacultyMember {
    name: string;
    role: string;
}

export interface FacultyCategory {
    category: string;
    members: FacultyMember[];
}

export const FACULTY_DATA: FacultyCategory[] = [
    {
        category: "Chief Patron",
        members: [
            {
                name: "Shri Ashu Goel",
                role: "Chairman, ABESIT Group of Institutions",
            },
        ],
    },
    {
        category: "Patron",
        members: [
            {
                name: "Prof.(Dr.) M.K Jha",
                role: "Advisor, ABESIT Group of Institutions",
            },
            {
                name: "Prof.(Dr.) Upasana Pandey",
                role: "Director, ABESIT Group of Institutions",
            },
        ],
    },
    {
        category: "Advisory Committee",
        members: [
            {
                name: "Prof.(Dr.) S.P. Gupta",
                role: "Dean Academics",
            },
            {
                name: "Prof.(Dr.) Amit Kumar Vats",
                role: "Dean Student Welfare",
            },
            {
                name: "Prof.(Dr.) Saurabh Agrawal",
                role: "Principal, College of Pharmacy",
            },
        ],
    },
    {
        category: "Conveners",
        members: [
            {
                name: "Prof.(Dr.) Shivani Sharma",
                role: "HOD - CSE(AI) & CSE(IOT)",
            },
            {
                name: "Prof.(Dr.) Hoshiyar Singh Kanyal",
                role: "HOD - CSE",
            },
            {
                name: "Prof.(Dr.) Kanika Taneja",
                role: "HOD - CSE(DS) & IT",
            },
            {
                name: "Prof.(Dr.) Kaushal Kishor",
                role: "HOD - MCA & BCA",
            },
        ],
    },
    {
        category: "Co-Conveners",
        members: [
            {
                name: "Prof. (Dr.) Vineet Kumar Singh",
                role: "Associate Professor-CSE (AI)",
            },
            {
                name: "Ms. Vineeta",
                role: "Assistant Professor-CSE (AI)",
            },
            {
                name: "Ms. Khushboo Saxena",
                role: "Assistant Professor-CSE (AI)",
            },
        ],
    },
    {
        category: "Faculty Co-Ordinator",
        members: [
            {
                name: "Ms. Meena Kumari",
                role: "Assistant Professor - CSE(IOT)",
            },
            {
                name: "Mr. Avdesh Kumar Tiwari",
                role: "Assistant Professor - CSE(AI)",
            },
            {
                name: "Dr. Sandeep Kumar",
                role: "Associate Professor - CSE",
            },
            {
                name: "Mr. Satyendra Singh",
                role: "Assistant Professor - CSE",
            },
            {
                name: "Ms. Deepti Singh",
                role: "Assistant Professor - IT",
            },
            {
                name: "Mr Chandrabhan Singh",
                role: "Assistant Professor - B.Pharma",
            },
            {
                name: "Mr. Ramjee Dixit",
                role: "Assistant Professor - MCA",
            },
            {
                name: "Mr. Ashish Kumar Maurya",
                role: "Assistant Professor - CSE(DS)",
            },
        ],
    },
];
