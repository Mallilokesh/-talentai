export interface JobMatch { title:string; company:string; location:string; salary:string; matchScore:number; tags:string[]; reason:string; jobType?:string }
export interface Candidate { name:string; currentRole:string; experience:string; location:string; matchScore:number; skills:string[]; summary:string }
export interface SeekerProfile { name:string; role:string; experience:string; location:string; skills:string; workType:string }
export interface JobPosting { title:string; company:string; location:string; skills:string; salary:string; description?:string }
