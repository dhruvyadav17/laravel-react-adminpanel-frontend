<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    protected function resetUrl($notifiable): string
    {
        $frontendUrl = config('app.frontend_url');

        return "{$frontendUrl}/reset-password?token={$this->token}&email={$notifiable->email}";
    }
}
