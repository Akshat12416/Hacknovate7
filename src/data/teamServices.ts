export interface Member {
    name: string;
    linkedin: string;
}

export interface Service {
    label: string;
    description: string;
    img: string;
    bgImg: string;
    members: Member[];
    rowLayout?: number[]; // Specifies how many members per row
}

// Sorted by label length (shortest → longest)
export const SERVICES: Service[] = [
    {
        label: "TECH TEAM",
        description: "",
        img: "/team/technical.jpeg",
        bgImg: "/event_bg/6df8fa1756996477cea9a22f532507db.jpg",
        rowLayout: [3, 2, 1],
        members: [
            { name: "Abhishek Tyagi", linkedin: "https://www.linkedin.com/in/abhiishektyagii" },
            { name: "Aayush Shukla", linkedin: "http://www.linkedin.com/in/aayush-shukla-592467297" },
            { name: "Pratham Sharma", linkedin: "https://www.linkedin.com/in/theprathamsharma" },
            { name: "Harshit Tiwari", linkedin: "https://www.linkedin.com/in/crown003" },
            { name: "Adarsh Singh", linkedin: "https://www.linkedin.com/in/adarsh-singh-44356b307" },
            { name: "Kaustubh Mishra", linkedin: "https://www.linkedin.com/in/kaustubh-mishra-292125324" }
        ]
    },
    {
        label: "DESIGN TEAM",
        description: "",
        img: "/team/design.jpeg",
        bgImg: "/event_bg/49504335ad5df8b63cd9dc8618036528.jpg",
        rowLayout: [3, 2, 3],
        members: [
            { name: "Aman", linkedin: "https://www.linkedin.com/in/aman-singh-kaushik-1a37a81a4" },
            { name: "Parth", linkedin: "https://www.linkedin.com/in/parthtyagi-design" },
            { name: "Sidharth", linkedin: "https://www.linkedin.com/in/sidharth-dubey-b501112a9" },
            { name: "Saumya", linkedin: "https://www.linkedin.com/in/saumya-singh-1aa642365" },
            { name: "Chahana", linkedin: "https://www.linkedin.com/in/chahana-39ba18328" },
            { name: "Manshi", linkedin: "https://www.linkedin.com/in/manshi75kumari" },
            { name: "Manvi", linkedin: "https://www.linkedin.com/in/manvi-gupta-55a193296" },
            { name: "Manswi", linkedin: "https://www.linkedin.com/in/manswi-singh" }
        ]
    },
    {
        label: "SOCIAL TEAM",
        description: "",
        img: "/team/social.jpeg",
        bgImg: "/event_bg/214bd17f74c2307c2ca8cc2c2c8a17bf.jpg",
        rowLayout: [3, 1, 2, 1],
        members: [
            { name: "Abhijeet Kumar", linkedin: "https://www.linkedin.com/in/abhijeet-kumar31" },
            { name: "Krishna Sharma", linkedin: "https://www.linkedin.com/in/krishna-sharma-838620336" },
            { name: "Suryansh Pratap Singh", linkedin: "https://www.linkedin.com/in/suryansh-pratap-singh-b0b69126b" },
            { name: "Abhinav Swami", linkedin: "https://www.linkedin.com/in/abhinav-swami-9026b32b9" },
            { name: "Nimisha Gangwar", linkedin: "https://www.linkedin.com/in/nimisha-gangwar-34283b33a" },
            { name: "Bhumika Upreti", linkedin: "https://www.linkedin.com/in/bhumika-upreti" },
            { name: "Aditi Sinha", linkedin: "https://www.linkedin.com/in/aditi-sinha-540693294" }
        ]
    },
    {
        label: "SPONSOR TEAM",
        description: "",
        img: "/team/sponsor.jpeg",
        bgImg: "/event_bg/oaud.jpg",
        members: [
            { name: "Yug Agarwal", linkedin: "https://www.linkedin.com/in/yugagarwal704" },
            { name: "Akshat Gour", linkedin: "https://www.linkedin.com/in/akshat12416" },
            { name: "Abharna Mishra", linkedin: "https://www.linkedin.com/in/abharna-a08273294" },
            { name: "Vishesh Jangir", linkedin: "https://www.linkedin.com/in/vishesh-jangir-274969291" }
        ]
    },
    {
        label: "OPERATIONS TEAM",
        description: "",
        img: "/team/operations.jpeg",
        bgImg: "/event_bg/122c692de71e326bb9c048b6ee61d744.jpg",
        members: [
            { name: "Murtaza", linkedin: "https://www.linkedin.com/in/mohd-murtaza-zaidi-b18a5b294" },
            { name: "Hariom", linkedin: "https://www.linkedin.com/in/hariom-sharma-b31163251" }
        ]
    },
    {
        label: "DECORATION TEAM",
        description: "",
        img: "/team/decoration.jpeg",
        bgImg: "/event_bg/af534511adb8f1d0bdbbf661c96b6965.jpg",
        rowLayout: [2, 2, 2, 2, 2],
        members: [
            { name: "Kavish Goyal", linkedin: "https://www.linkedin.com/in/kavish-goyal-15837932b" },
            { name: "Bhaskar Shukla", linkedin: "https://www.linkedin.com/in/bhaskar-shukla-a79744336" },
            { name: "Sakshi", linkedin: "https://www.linkedin.com/in/sakshi-tripathi-847081384" },
            { name: "Vanshika", linkedin: "https://www.linkedin.com/in/vanshika-chaudhary-63a63a341" },
            { name: "Lakshika", linkedin: "https://www.linkedin.com/in/lakshika-bourai" },
            { name: "Aditi", linkedin: "https://www.linkedin.com/in/aditi-srivastava-723898281" },
            { name: "Vanshika ", linkedin: "https://www.linkedin.com/in/vanshika-deovanshi-0b1379350" },
            { name: "Kashish Jain", linkedin: "https://www.linkedin.com/in/kashish-jain-897207320" },
            { name: "Insha Riaz", linkedin: "https://www.linkedin.com/in/insha-riyaz-ba8803315" },
            { name: "Ishika", linkedin: "https://www.linkedin.com/in/ishika-gupta-77554631b" }
        ]
    },
    {
        label: "VOLUNTEER AND DISCIPLINE TEAM",
        description: "",
        img: "/team/volunteer.jpeg",
        bgImg: "/event_bg/49504335ad5df8b63cd9dc8618036528.jpg",
        members: [
            { name: "Tanishq", linkedin: "https://www.linkedin.com/in/tanishq-mittal-b11a78352" },
            { name: "Tanya", linkedin: "https://www.linkedin.com/in/tanya-garg-866960295" }
        ]
    }
];
