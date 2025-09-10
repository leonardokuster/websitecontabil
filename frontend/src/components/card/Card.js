import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Image from "next/image";
import styles from './card.module.css';

export default function FeedbackCard(props) {
  return (
    <Card className={styles['card']}>
      <CardContent className={styles['cardContent']}>
        <Image src={props.photo} alt="Foto de perfil" width={54} height={53}/>

        <Box component="div">
          <Typography className={styles['name']}>
            {props.name}
          </Typography>
          <Typography className={styles['message']}>
            {props.message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}