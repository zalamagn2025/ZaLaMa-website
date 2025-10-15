import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fonction pour hasher le mot de passe avec salt
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

// Fonction pour vérifier le mot de passe
function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  return hash === verifyHash;
}

// GET - Valider le token d'activation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token manquant' },
        { status: 400 }
      );
    }

    // Rechercher l'employé avec ce token d'activation
    const { data: employee, error } = await supabase
      .from('employees')
      .select('id, nom, prenom, email, activation_token, password_set')
      .eq('activation_token', token)
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { success: false, error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Vérifier si le mot de passe a déjà été défini
    if (employee.password_set) {
      return NextResponse.json(
        { success: false, error: 'Ce compte a déjà été activé' },
        { status: 400 }
      );
    }

    // Token valide, retourner les informations de l'employé
    return NextResponse.json({
      success: true,
      employee: {
        nom: employee.nom,
        prenom: employee.prenom,
        email: employee.email
      }
    });

  } catch (error) {
    console.error('Erreur lors de la validation du token:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Définir le mot de passe et activer le compte
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, pin } = body;
    
    // Accepter soit "password" soit "pin" pour la compatibilité
    const actualPassword = password || pin;

    if (!token || !actualPassword) {
      return NextResponse.json(
        { success: false, error: 'Token et mot de passe requis' },
        { status: 400 }
      );
    }

    if (actualPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Rechercher l'employé avec ce token d'activation
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('id, nom, prenom, email, activation_token, password_set, user_id')
      .eq('activation_token', token)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { success: false, error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    // Vérifier si le mot de passe a déjà été défini
    if (employee.password_set) {
      return NextResponse.json(
        { success: false, error: 'Ce compte a déjà été activé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = hashPassword(actualPassword);

    // Mettre à jour l'employé avec le mot de passe hashé et consommer le token
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        password_hash: hashedPassword,
        password_set: true,
        activation_token: null, // Consommer le token
        updated_at: new Date().toISOString()
      })
      .eq('id', employee.id);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du mot de passe:', updateError);
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la définition du mot de passe' },
        { status: 500 }
      );
    }

    // Si l'employé a un user_id, mettre à jour le mot de passe dans Supabase Auth
    if (employee.user_id) {
      try {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          employee.user_id,
          { password: actualPassword }
        );

        if (authError) {
          console.error('Erreur lors de la mise à jour du mot de passe Auth:', authError);
          // Ne pas échouer complètement si l'update Auth échoue
        }
      } catch (authError) {
        console.error('Erreur lors de la mise à jour du mot de passe Auth:', authError);
        // Ne pas échouer complètement si l'update Auth échoue
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Mot de passe défini avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la définition du mot de passe:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
