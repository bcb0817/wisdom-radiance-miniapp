"use client";
import {useEffect} from "react";
import {initializeLineSession} from "../lib/lineSessionClient";
export default function LiffInitializer(){useEffect(()=>{void initializeLineSession()},[]);return null}
